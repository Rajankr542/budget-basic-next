import Link from 'next/link';

const bgColorIndex = [1, 2, 3, 4, 5, 6];

export default function Card({ chapter, isHindi=false }) {
  bgColorIndex.push(bgColorIndex[chapter.index]);
  return (
        <li
      className={isHindi ? "chapter_card_parent hn" : "chapter_card_parent"}
    > 
      <Link key={chapter.index} href={`/${chapter.slug}`}>
        <a className="new_card__content no_focus">
          {/* {chapter.totalArticles == 0 && (
            <>
              <img
                src="/assets/icons/coming_soon.png"
                alt=""
                className="card__soon"
              />
              <span className="screen-reader-text">Coming Soon:</span>
            </>
          )} */}
          <picture className="new_card__image">
            <source
              srcSet={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${chapter.icon.url}`}
              media="(min-width: 100px)"
            />

            <img
              src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
              alt=""
              width="1"
              height="1"
            />
          </picture>
          <div className="card_text_container">
          <h2 className="new_card__title">{chapter.title}</h2>
        </div>
        </a>
      </Link>
    </li>
  );
}
