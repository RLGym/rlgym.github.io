import React from 'react';
import Link from '@docusaurus/Link';
import {
  faDiscord,
  faTwitter,
  faTwitch,
  faPatreon,
  faGithub,
  faPython
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useBaseUrl from '@docusaurus/useBaseUrl';

const iconMap = {
  discord: faDiscord,
  twitter: faTwitter,
  twitch: faTwitch,
  patreon: faPatreon,
  github: faGithub,
  pip: faPython,
};

export default function FooterLinkItem({item}) {
  const {to, href, label, type} = item;
  const toUrl = useBaseUrl(to);
  const icon = type ? iconMap[type] : null;

  return (
    <Link
      className="footer__link-item"
      {...(href ? { href } : { to: toUrl })}>
      {icon && <FontAwesomeIcon icon={icon} style={{marginRight: '0.5rem'}} />}
      {label}
    </Link>
  );
}
