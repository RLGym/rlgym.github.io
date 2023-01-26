import React from 'react';
import {
    faBook,
    faLaptopCode,
    faLightbulb,
    faMapSigns,
    faRocket, faTools,
    IconDefinition
} from '@fortawesome/free-solid-svg-icons';
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
      <Link to={link} style={{ height: '100%', textDecoration: 'none' }} >
          <div style={{ height: '100%', padding: 12, color: 'var(--ifm-font-color-base)' }} >
              <div className={'card shadow--lw'} style={{ height: '100%' }}>
                  <div className={'card__header'} style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                      <div style={{borderRadius: '30px', height: '60px', width: '60px', display: 'flex', justifyContent: 'center', alignItems:'center'}}>
                          <FontAwesomeIcon icon={Svg}  style={{ fontSize: '30px', color: "var(--ifm-breadcrumb-color-active)"}}/>
                      </div>
                      <h3 style={{flex: 1, paddingLeft: '1em'}}>{title}</h3>
                  </div>
                  <div className={'card__body'}>
                    <p>{description}</p>
                  </div>
              </div>
          </div>
      </Link>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
      <div className={'container'}>
          <div className={'row'}>
              {FeatureList.map((props) => (
                  <div className={'col col--4'} key={props.title}>
                    <Feature {...props} />
                  </div>
              ))}
          </div>
      </div>
  );
}
