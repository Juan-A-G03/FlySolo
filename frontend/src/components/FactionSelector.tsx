import { useState } from 'react';

export type Faction = 'REBEL' | 'IMPERIAL' | 'NEUTRAL';

interface FactionSelectorProps {
  value?: Faction;
  onChange: (faction: Faction) => void;
  required?: boolean;
  className?: string;
}

const factionInfo = {
  REBEL: {
    name: 'Alianza Rebelde',
    icon: '⚡',
    color: '#ff6b3d',
    description: 'Luchadores por la libertad contra el Imperio'
  },
  IMPERIAL: {
    name: 'Imperio Galáctico',
    icon: '⭐',
    color: '#6366f1',
    description: 'Orden y poder en toda la galaxia'
  },
  NEUTRAL: {
    name: 'Neutral',
    icon: '🤝',
    color: '#6b7280',
    description: 'Sin afiliación política'
  }
};

export const FactionSelector = ({ 
  value, 
  onChange, 
  required = false, 
  className = '' 
}: FactionSelectorProps) => {
  const [selectedFaction, setSelectedFaction] = useState<Faction | undefined>(value);

  const handleSelect = (faction: Faction) => {
    setSelectedFaction(faction);
    onChange(faction);
  };

  return (
    <div className={`faction-selector ${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-3">
        Elige tu bando {required && <span className="text-red-400">*</span>}
      </label>
      
      <div className="grid gap-3">
        {(Object.keys(factionInfo) as Faction[]).map((faction) => {
          const info = factionInfo[faction];
          const isSelected = selectedFaction === faction;
          
          return (
            <div
              key={faction}
              onClick={() => handleSelect(faction)}
              className={`faction-option ${isSelected ? 'selected' : ''}`}
              style={{
                borderColor: isSelected ? info.color : '#374151',
                backgroundColor: isSelected ? `${info.color}20` : 'transparent'
              }}
            >
              <div className="faction-icon" style={{ color: info.color }}>
                {info.icon}
              </div>
              <div className="faction-info">
                <h3 className="faction-name" style={{ color: isSelected ? info.color : '#e5e7eb' }}>
                  {info.name}
                </h3>
                <p className="faction-description">
                  {info.description}
                </p>
              </div>
              {isSelected && (
                <div className="faction-check" style={{ color: info.color }}>
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};