import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <p>
        このサービスは、国土交通データプラットフォームのAPI機能を使用していますが、最新のデータを保証するものではありません。
      </p>
      <p>&copy; {currentYear} Your Company. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
