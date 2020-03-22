module.exports = {
    root: true,
    env: {
        node: true,
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard',
        '@vue/typescript',
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'semi': 0,
        'space-before-function-paren': 'off',
        'object-curly-spacing': 'off',
        'no-trailing-spaces': 'off',
        'indent': 'off',
        'quotes': 'off',
        'comma-dangle': 'off',
        'spaced-comment': 'off',
        'no-unused-vars': 'off',
        'vue/no-unused-vars': 'off',
        'vue/no-unused-components': 'off',
        "no-tabs":"off",
    },
    parserOptions: {
        parser: '@typescript-eslint/parser'
    },
    overrides: [
        {
            files: [
                '**/__tests__/*.{j,t}s?(x)',
                '**/tests/unit/**/*.spec.{j,t}s?(x)'
            ],
            env: {
                jest: true,
            },
            rules: {
                'no-unused-vars': 'off',
                '@typescript-eslint/no-unused-vars': 'off',
                'vue/no-unused-vars': 'off',
                'vue/no-unused-components': 'off'
            }
        }
    ],
    
};
