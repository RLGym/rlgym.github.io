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
    title: 'Getting Started',
    Svg: faMapSigns,
    description: (
      <>
        Learn what RLGym is and how to get started.
      </>
    ),
    link: '/Getting Started/introduction/'
  },
  {
    title: 'Rocket League',
    Svg: faRocket,
    description: (
      <>
        Train your first Rocket League bot and learn how to customize your environment.
      </>
    ),
    link: '/Rocket League/training_an_agent/'
  },
  {
    title: 'Custom Environments',
    Svg: faLaptopCode,
    description: (
      <>
        Create your own reinforcement learning environments using RLGym.
      </>
    ),
    link: '/Custom Environments/custom-environment/'
  },
  {
    title: 'API Reference',
    Svg: faBook,
    description: (
      <>
        Detailed documentation of RLGym's API.
      </>
    ),
    link: 'https://captainglac1er.github.io/rocket-league-gym/'
  },
  {
    title: 'RLGym Tools',
    Svg: faTools,
    description: (
      <>
        A collection of useful tools for RLGym.
      </>
    ),
    link: '/RLGym%20Tools/introduction/'
  },
  {
    title: 'RLGym Learn',
    Svg: faTools,
    description: (
      <>
        A generic learning framework for RLGym.
      </>
    ),
    link: '/RLGym%20Learn/introduction/'
  }
  
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
