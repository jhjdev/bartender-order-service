import React from 'react';
import { useTranslation } from 'react-i18next';

const LoyaltyProgram: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {t('navigation.loyaltyProgram')}
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">
            🚧 Under Construction 🚧
          </h2>
          <p className="text-gray-600 mb-6">
            We're building an amazing loyalty program for our customers!
          </p>
          <div className="text-left max-w-2xl mx-auto">
            <h3 className="font-semibold mb-2">Coming Features:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Points-based reward system</li>
              <li>Multiple membership tiers</li>
              <li>Special member events and promotions</li>
              <li>Birthday rewards</li>
              <li>Referral program</li>
              <li>Points history and redemption tracking</li>
              <li>Automated rewards and notifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyProgram;
