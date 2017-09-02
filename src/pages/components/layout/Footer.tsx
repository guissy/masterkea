import * as React from 'react';
import environment from '../../../utils/environment';
import './Footer.css';

// tslint:disable-next-line variable-name
const Footer = () =>
  <div className="footer">
    {environment.footerText}
  </div>;

export default Footer;
