import React from 'react';
import { TermsOfUse } from './TermsOfUse';
import './Footer.css';

export function Footer() {
    return (
      <footer>
        <TermsOfUse/>
        <p>&copy; 2024 REI Project. All rights reserved.</p>
      </footer>
    );
}