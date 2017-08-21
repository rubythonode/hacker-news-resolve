import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/paginator.css';

class Paginator extends React.PureComponent {
  scrollUp = () => {
    window.scrollTo(0, 0);
  };

  render() {
    const { page = 1, hasNext, location } = this.props;
    const { pathname } = location;

    if (page === 1 && !hasNext) {
      return null;
    }
    const nextDisabledClassName = !hasNext && 'paginator__disabled';
    const prevDisabledClassName = page <= 1 && 'paginator__disabled';

    return (
      <div className="paginator">
        <Link
          className={prevDisabledClassName}
          to={`${pathname}?page=${Number(page) - 1}`}
          onClick={this.scrollUp}
        >
          <span className={prevDisabledClassName}>Prev</span>
        </Link>
        {` | ${page} | `}
        <Link
          className={nextDisabledClassName}
          to={`${pathname}?page=${Number(page) + 1}`}
          onClick={this.scrollUp}
        >
          <span className={nextDisabledClassName}>More</span>
        </Link>
      </div>
    );
  }
}

export default Paginator;