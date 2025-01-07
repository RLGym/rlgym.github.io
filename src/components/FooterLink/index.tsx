import React from 'react';
import {
  faDiscord,
  faTwitter,
  faTwitch,
  faPatreon,
  faGithub,
  faPython
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from '@docusaurus/Link';

type FooterLinkProps = {
  type: string;
  label: string;
  href: string;
};

const iconMap = {
  discord: faDiscord,
  twitter: faTwitter,
  twitch: faTwitch,
  patreon: faPatreon,
  github: faGithub,
  pip: faPython,
};

export default function FooterLink({ type, label, href }: FooterLinkProps) {
  const icon = iconMap[type];
  if (!icon) return null;

  return (
    <Link to={href} className="footer__link-item">
      <FontAwesomeIcon icon={icon} style={{ marginRight: '0.3rem', width: '1em' }} />
      {label}
    </Link>
  );
}
