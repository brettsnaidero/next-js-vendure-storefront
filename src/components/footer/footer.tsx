import React from 'react';
import Link from 'next/link';
import styles from '@/styles/components/footer.module.css';
import Button from '@/components/button';
import Input from '@/components/form/input';
import Field from '@/components/form/field';
import { useForm } from 'react-hook-form';

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

const Footer = ({ collections }: { collections: any[] }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <footer aria-labelledby="footer-heading" className={styles.footer}>
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className={styles.layout}>
        <div className={styles.columns}>
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

        <div>
          <h3>Subscribe to our newsletter</h3>
          <p>Be the first to know about exclusive offers & deals.</p>
          <form className={styles.subscribe} onSubmit={handleSubmit(onSubmit)}>
            <Field
              label="Email address"
              htmlFor="subscribe__email-address"
              errorMessage={errors.email?.message}
            >
              <Input
                type="email"
                id="subscribe__email-address"
                autoComplete="email"
                placeholder="Enter your email"
                {...register('email', { required: true })}
                stretched
              />
            </Field>
            <Button type="submit" size="small">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
