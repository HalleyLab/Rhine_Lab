(function () {
    'use strict';

    // The publishable/anon key is safe to use in a browser when RLS is enabled.
    // Never place a service_role key in this file.
    window.RHINE_LAB_CONFIG = Object.assign({
        supabaseUrl: '',
        supabasePublishableKey: '',
        labId: '',
        autoInitializeLab: false,
        seedUrl: './data/seed.json'
    }, window.RHINE_LAB_CONFIG || {});
}());
