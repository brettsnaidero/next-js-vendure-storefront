import React from 'react';
import Link from 'next/link';

const navigation = {
  support: [
    { name: 'Help', href: '#' },
    { name: 'Track order', href: '#' },
    { name: 'Shipping', href: '#' },
    { name: 'Returns', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Corporate responsibility', href: '#' },
    { name: 'Press', href: '#' },
  ],
};

const Footer = () => {
  const collections = [];

  return (
    <footer aria-labelledby="footer-heading">
      <h2 id="footer-heading">Footer</h2>
      <div>
        <div>
          <div>
            <div>
              <div>
                <h3>Shop</h3>
                <ul role="list">
                  {collections.map((collection) => (
                    <li key={collection.id}>
                      <Link
                        href={'/collections/' + collection.slug}
                        // prefetch="intent"
                      >
                        {collection.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Support</h3>
                <ul role="list">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <div>
                <h3>Company</h3>
                <ul role="list">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h3>Subscribe to our newsletter</h3>
            <p>Be the first to know about exclusive offers & deals.</p>
            <form>
              <label htmlFor="email-address">Email address</label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                autoComplete="email"
                required
                placeholder="Enter your email"
              />
              <div>
                <button type="submit">Subscribe</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
