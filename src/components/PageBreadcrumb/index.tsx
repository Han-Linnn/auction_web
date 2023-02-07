import React from 'react';
import { history, useIntl } from 'umi'

const PageBreadcrumb: React.FC<{
  props: {
    routes: any
  }
}> = (props) => {
  const { routes } = props;
  const { formatMessage } = useIntl();

  return (
    <>
      <div className="container">
        <ul className="breadcrumb">
          <li>
            <a onClick={() => history.push('/')}>
              {formatMessage({ id: 'project.menu.home', defaultMessage: '首页' })}
            </a>
          </li>
          {routes.map((item: any, index: number) => {
            if (index === routes.length - 1) {
              return (
                <li key={item.name}>
                  <span>{item.name}</span>
                </li>
              )
            }
            return (
              <li key={item.name}>
                <a
                  onClick={() => item.path ? history.push(item.path) : null}
                >
                  {item.name}
                </a>
              </li>
            )
          })}

        </ul>
      </div>

      <div className="section-header cl-white mw-100 left-style" />
    </>
  );
};
export default PageBreadcrumb;
