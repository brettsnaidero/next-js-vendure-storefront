import { StarIcon } from '@heroicons/react/24/solid';
import styles from '@/styles/components/reviews.module.css';

interface Review {
  id: number;
  title: string;
  rating: number;
  content: string;
  author: string;
  date: string;
  datetime: string;
}

const reviews: Review[] = [
  {
    id: 1,
    title: 'I love it!',
    rating: 5,
    content: `
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            `,
    author: 'Ryan F',
    date: 'May 25, 2022',
    datetime: '2022-05-25',
  },
  {
    id: 2,
    title: 'Awesome product',
    rating: 5,
    content: `
              <p>Ornare quam viverra orci sagittis eu volutpat odio. Massa id neque aliquam vestibulum morbi blandit cursus risus at. Ultrices tincidunt arcu non sodales neque.</p> 
              <p>Mattis pellentesque id nibh tortor id aliquet lectus proin nibh. Pellentesque diam volutpat commodo sed egestas egestas fringilla. Sodales ut etiam sit amet nisl purus in mollis nunc. Turpis egestas integer eget aliquet nibh praesent tristique magna. Augue interdum velit euismod in pellentesque massa placerat duis ultricies. Justo laoreet sit amet cursus sit amet.</p>
            `,
    author: 'Kent D',
    date: 'May 24, 2022',
    datetime: '2022-05-24',
  },
  {
    id: 3,
    title: 'Really happy with this purchase',
    rating: 5,
    content: `
              <p>Nisi est sit amet facilisis magna etiam tempor orci eu.</p> 
              <p>Elit duis tristique sollicitudin nibh sit amet commodo. Dolor sit amet consectetur adipiscing elit. Lorem dolor sed viverra ipsum nunc. Accumsan tortor posuere ac ut consequat semper. Augue mauris augue neque gravida in fermentum et sollicitudin ac.</p>
            `,
    author: 'Michael J',
    date: 'May 24, 2022',
    datetime: '2022-05-24',
  },
];

const TopReviews = () => (
  <div className={styles.reviews}>
    <h2>Recent reviews</h2>

    {reviews.map((review) => (
      <div key={review.id} className={styles.review}>
        <div>
          <div className={styles.rating}>
            <div className={styles.stars}>
              {[0, 1, 2, 3, 4].map((rating) => (
                <StarIcon
                  key={rating}
                  className={review.rating > rating ? 'rating' : ''}
                  aria-hidden="true"
                  width={20}
                  height={20}
                />
              ))}
            </div>
            <p>
              {review.rating}
              <span> out of 5 stars</span>
            </p>
          </div>

          <div className={styles.actual}>
            <h3>{review.title}</h3>

            <div
              dangerouslySetInnerHTML={{
                __html: review.content,
              }}
            />
          </div>
        </div>

        <div className={styles.citation}>
          <p className={styles.author}>{review.author}</p>
          <time dateTime={review.datetime}>{review.date}</time>
        </div>
      </div>
    ))}
  </div>
);

export default TopReviews;
