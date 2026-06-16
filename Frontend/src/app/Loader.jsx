import React from 'react'

const Loader = ({ fullScreen = true, text = "Syncing workspace..." }) => {
  return (
    <div className={fullScreen ? "loader-container" : "flex flex-col items-center justify-center p-8 w-full"}>
      <div className="loader-wrapper">
        <div className="loader-rings">
          <div className="ring-outer"></div>
          <div className="ring-inner"></div>
          <div className="ring-center-orb"></div>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <span className="loader-logo">Cerebro AI</span>
          {text && <span className="loader-subtext">{text}</span>}
        </div>
      </div>
    </div>
  )
}

export default Loader
