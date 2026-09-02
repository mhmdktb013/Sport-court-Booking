import React from 'react';
import { useVenue } from '../../context/VenueContext';

const MinimalFooter = () => {
  const { venue } = useVenue();
  const brandName = venue?.name || '';
  const phone = venue?.phone || venue?.whatsappNumber || '';

  return (
    <footer className="bk-minimal-footer">
      <span>© {new Date().getFullYear()} {brandName}</span>
      {phone && <span className="bk-minimal-footer-sep">·</span>}
      {phone && <span>{phone}</span>}
    </footer>
  );
};

export default MinimalFooter;
