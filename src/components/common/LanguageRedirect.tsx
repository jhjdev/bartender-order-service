import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LanguageRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    navigate(`/${i18n.language}/menu/drinks`);
  }, [navigate, i18n.language]);

  return null;
};

export default LanguageRedirect;
