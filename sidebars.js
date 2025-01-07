/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'Getting Started/introduction',
        'Getting Started/overview',
        'Getting Started/quickstart',
      ],
    },
    {
      type: 'category',
      label: 'Rocket League',
      items: [
        'Rocket League/training_an_agent',
        {
          type: 'category',
          label: 'Configuration Objects',
          items: [
            'Rocket League/Configuration Objects/action_parsers',
            'Rocket League/Configuration Objects/done_conditions',
            'Rocket League/Configuration Objects/observation_builders',
            'Rocket League/Configuration Objects/renderers',
            'Rocket League/Configuration Objects/reward_functions',
            'Rocket League/Configuration Objects/state_mutators',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Custom Environments',
      items: [
        'Custom Environments/custom-environment',
      ],
    },
    {
      type: 'category',
      label: 'Cheatsheets',
      items: [
        'Cheatsheets/game_values',
        'Cheatsheets/reinforcement_learning_terms',
      ],
    },
  ],
};

module.exports = sidebars;
