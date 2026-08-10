(function () {
    'use strict';

    // The publishable/anon key is safe to use in a browser when RLS is enabled.
    // Never place a service_role key in this file.
    window.RHINE_LAB_CONFIG = Object.assign({
        supabaseUrl: 'https://tyjaprmkrjxgccsnqwog.supabase.co',
        supabasePublishableKey: 'sb_publishable_7OQarZUrwQw9UdqTfGFaQw_vO5AqAQa',
        labId: '949b4853-dd8b-47f7-899d-259c8694a9a7',
        autoInitializeLab: true,
        seedUrl: './data/seed.json'
    }, window.RHINE_LAB_CONFIG || {});
}());
