import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import {
    faBook,
    faLaptopCode,
    faLightbulb,
    faMapSigns,
    faRocket, faTools,
    IconDefinition
} from '@fortawesome/free-solid-svg-icons';;
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Link from "@docusaurus/Link";

type FeatureItem = {
  title: string;
  Svg: IconDefinition;
  description: JSX.Element;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Introduction',
    Svg: faMapSigns,
    description: (
      <>
        Learn what RLGym is, how it works, and how to install it.
      </>
    ),
      link: '/docs/introduction/'
  },
  {
    title: 'Getting Started',
    Svg: faRocket,
    description: (
      <>
          Set up a basic environment, learn how to interact with the game and train a simple agent.
      </>
    ),
      link: '/docs/getting-started/'
  },
  {
    title: 'Documentation',
    Svg: faBook,
    description: (
      <>
        API Documentation
      </>
    ),
      link: '/docs/category/documentation'
  },
    {
        title: 'Tutorials',
        Svg: faLaptopCode,
        description: (
            <>
                Tutorials for all the basic functionality of RLGym.
            </>
        ),
        link: '/docs/category/tutorials'
    },
    {
        title: 'FAQs',
        Svg: faLightbulb,
        description: (
            <>
                Frequently Asked Questions (no I will not implement PPO for you).
            </>
        ),
        link: '/docs/faq/'
    },
    {
        title: 'Troubleshooting',
        Svg: faTools,
        description: (
            <>
                Solutions to various common installation problems and runtime errors.
            </>
        ),
        link: '/docs/troubleshooting/'
    },
];

function Feature({title, Svg, description, link}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <Link
          to={link}>
      <div className="text--center">
        <FontAwesomeIcon icon={Svg} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={props.title} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
