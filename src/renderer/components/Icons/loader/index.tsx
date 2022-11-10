import * as React from 'react';
import styled from '@emotion/styled';

const LoaderContainer = styled.div`
  align-items: center;
  background-color: rgba(41, 128, 185, .7);
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 10;
`;

export interface ILoaderProps {
  show: boolean
}

const Loader: React.SFC<ILoaderProps> = ({ show }) => {
  if (!show) return null;

  return (
    // TODO: Refactor loader behaviour for smoother transitions
    <LoaderContainer>
      <svg
        height="57"
        stroke="#fff"
        viewBox="0 0 57 57"
        width="57"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          fill="none"
          fillRule="evenodd"
        >
          <g
            strokeWidth="2"
            transform="translate(1 1)"
          >
            <circle
              cx="5"
              cy="50"
              r="5"
            >
              <animate
                attributeName="cy"
                begin="0s"
                calcMode="linear"
                dur="2.2s"
                repeatCount="indefinite"
                values="50;5;50;50"
              />
              <animate
                attributeName="cx"
                begin="0s"
                calcMode="linear"
                dur="2.2s"
                repeatCount="indefinite"
                values="5;27;49;5"
              />
            </circle>
            <circle
              cx="27"
              cy="5"
              r="5"
            >
              <animate
                attributeName="cy"
                begin="0s"
                calcMode="linear"
                dur="2.2s"
                from="5"
                repeatCount="indefinite"
                to="5"
                values="5;50;50;5"
              />
              <animate
                attributeName="cx"
                begin="0s"
                calcMode="linear"
                dur="2.2s"
                from="27"
                repeatCount="indefinite"
                to="27"
                values="27;49;5;27"
              />
            </circle>
            <circle
              cx="49"
              cy="50"
              r="5"
            >
              <animate
                attributeName="cy"
                begin="0s"
                calcMode="linear"
                dur="2.2s"
                repeatCount="indefinite"
                values="50;50;5;50"
              />
              <animate
                attributeName="cx"
                begin="0s"
                calcMode="linear"
                dur="2.2s"
                from="49"
                repeatCount="indefinite"
                to="49"
                values="49;5;27;49"
              />
            </circle>
          </g>
        </g>
      </svg>
    </LoaderContainer>
  );
};

export default Loader;
