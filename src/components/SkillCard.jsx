"use client"

import { useWeb3 } from "../contexts/Web3Context"
import "./SkillCard.css"

const SkillCard = ({ skill, onBuy, onList, onRemoveFromSale, showActions = true, isOwner = false }) => {
  const { account } = useWeb3()

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  const getInitials = (address) => {
    return address.slice(2, 4).toUpperCase()
  }

  const isCurrentUserOwner = account && (skill.owner === account || skill.creator === account)

  return (
    <div className="skill-card">
      <div className="skill-card-header">
        <div className="skill-card-title-row">
          <h3 className="skill-card-title">{skill.skillName}</h3>
          <span className="skill-card-badge">#{skill.tokenId}</span>
        </div>

        <div className="skill-card-creator">
          <span>👤</span>
          <span>Creator:</span>
          <div className="creator-info">
            <div className="creator-avatar">{getInitials(skill.creator)}</div>
            <span>{formatAddress(skill.creator)}</span>
          </div>
        </div>
      </div>

      <div className="skill-card-content">
        {/* Skill Image Placeholder */}
        <div className="skill-image">
          <div className="skill-image-content">
            <span className="skill-icon">🏷️</span>
            <p className="skill-name">{skill.skillName}</p>
          </div>
        </div>

        <div className="skill-details">
          {skill.isForSale && (
            <div className="price-info">
              <span>💰</span>
              <span className="price">{skill.price} ETH</span>
              <span className="for-sale-badge">For Sale</span>
            </div>
          )}

          <div className="created-date">
            <span>📅</span>
            <span>Created: {formatDate(skill.createdAt)}</span>
          </div>
        </div>
      </div>

      {showActions && (
        <div className="skill-card-footer">
          <div className="skill-actions">
            {skill.isForSale && !isCurrentUserOwner && onBuy && (
              <button onClick={() => onBuy(skill.tokenId, skill.price)} className="btn btn-primary w-full">
                Buy for {skill.price} ETH
              </button>
            )}

            {isCurrentUserOwner && (
              <div className="owner-actions">
                {skill.isForSale
                  ? onRemoveFromSale && (
                      <button onClick={() => onRemoveFromSale(skill.tokenId)} className="btn btn-outline w-full">
                        Remove from Sale
                      </button>
                    )
                  : onList && (
                      <button onClick={() => onList(skill)} className="btn btn-outline w-full">
                        List for Sale
                      </button>
                    )}
              </div>
            )}

            {!skill.isForSale && !isCurrentUserOwner && <div className="not-for-sale">Not for sale</div>}
          </div>
        </div>
      )}
    </div>
  )
}

export default SkillCard
