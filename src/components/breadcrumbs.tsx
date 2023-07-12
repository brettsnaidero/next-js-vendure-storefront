import { HomeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import styles from '@/styles/components/breadcrumbs.module.css';

const ROOT_COLLECTION_NAME = '__root_collection__';

const Breadcrumbs = ({
  items,
}: {
  items: { name: string; slug: string; id: string }[];
}) => {
  return (
    <nav>
      <ol role="list" className={styles.breadcrumbs}>
        <li className={styles.hasIcon}>
          <Link href="/">
            <span className={styles.icon}>
              <HomeIcon width={20} height={20} />
            </span>
            <span>Home</span>
          </Link>
        </li>
        {items
          .filter((item) => item.name !== ROOT_COLLECTION_NAME)
          .map((item) => (
            <li key={item.name}>
              <div className={styles.break}>
                <span>/</span>
              </div>
              <Link href={`/collections/${item.slug}`}>{item.name}</Link>
            </li>
          ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
