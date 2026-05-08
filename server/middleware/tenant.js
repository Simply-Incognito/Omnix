"use strict";

const Store = require(`${__dirname}/../models/Store`);

const asyncErrorHandler = require(`${__dirname}/../utils/asyncErrorHandler`);

const attachTenant = asyncErrorHandler(async (req, res, next) => {
    let storeId = null;

        // Scenario 1: A Vendor Admin is logged in.
        // We find the store they own based on their User ID.
        if (req.user && req.user.role === 'vendor_admin') {
            const store = await Store.findOne({ owner: req.user._id });
            if (store) {
                storeId = store._id;
            } else {
                return res.status(403).json({ message: "No store found for this vendor." });
            }
        }

        // Scenario 2: A Customer or Public User is browsing the storefront.
        // The frontend will send the Store ID or Slug in the HTTP Headers.
        else if (req.headers['x-tenant-id']) {
            storeId = req.headers['x-tenant-id'];
        }
        else if (req.headers['x-tenant-slug']) {
            const store = await Store.findOne({ slug: req.headers['x-tenant-slug'] });
            if (store) {
                storeId = store._id;
            }
        }

        // Scenario 3: If no store could be determined, and the user isn't a super admin, block access.
        // (You can tweak this logic based on whether the route needs to be public for ALL stores)
        if (!storeId && (!req.user || req.user.role !== 'super_admin')) {
            return res.status(400).json({ message: "Store context is required. Please provide a tenant ID or slug." });
        }

        // Inject the storeId into the request object!
        req.storeId = storeId;

        next();
});

module.exports = { attachTenant };
