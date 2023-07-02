import { HomeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

const Breadcrumbs = ({
  items,
}: {
  items: { name: string; slug: string; id: string }[];
}) => {
  return (
    <nav>
      <ol role="list">
        <li>
          <div>
            <Link href="/">
              <HomeIcon />
              <span>Home</span>
            </Link>
          </div>
        </li>
        {items
          .filter((item) => item.name !== '__root_collection__')
          .map((item, index) => (
            <li key={item.name}>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <Link href={`/collections/${item.slug}`}>{item.name}</Link>
              </div>
            </li>
          ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
