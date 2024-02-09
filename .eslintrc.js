module.exports = {
    parserOptions: {
        ecmaVersion: 2020,
    },
    extends: [
        'plugin:react/recommended',
        'plugin:@next/next/core-web-vitals',
        'plugin:import/recommended',
        'airbnb',
        'plugin:tailwindcss/recommended',
    ],
    plugins: [
        'react',
        'import',
    ],
    rules: {
        indent: ['error', 4],
        curly: ['error', 'all'],
        'max-len': 'off',
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/jsx-max-props-per-line': ['error', { maximum: 1 }],
        'react/react-in-jsx-scope': 'off',
        'import/prefer-default-export': 'off',
        'import/order': ['error', { groups: ['external', 'builtin', 'object', 'type', 'index', 'sibling', 'parent', 'internal'] }],
        'jsx-a11y/anchor-is-valid': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-a11y/control-has-associated-label': 'off',
        'tailwindcss/no-custom-classname': ['warn', {
            whitelist: [
                'adsbygoogle',
            ],
        }],
        'react/prop-types': 'off',
        'react/jsx-props-no-spreading': 'off',
        'import/no-unresolved': 'off',
        'import/extensions': 'off',
        '@next/next/no-img-element': 'off',
        'no-console': 'off',
        'no-param-reassign': 'off',
        'react/jsx-filename-extension': 'off',
        'jsx-a11y/heading-has-content': 'off',
        'no-loop-func': 'off',
        'no-restricted-syntax': 'off',
    },
    settings: {
        'import/resolver': {
            alias: {
                extensions: ['.js', '.jsx'],
                map: [
                    ['@', '.'],
                ],
            },
        },
    },
};
