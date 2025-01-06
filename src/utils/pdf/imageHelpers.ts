export const getDoorHandingImage = (handing: string) => {
  switch (handing) {
    case 'lh-in':
      return "/1p_LH_Inswing.jpg";
    case 'lh-out':
      return "/1p_LH_Outswing.jpg";
    case 'rh-in':
      return "/1p_RH_Inswing.jpg";
    case 'rh-out':
      return "/1p_RH_Outswing.jpg";
    default:
      return "/1p_LH_Inswing.jpg";
  }
};

export const getWindowImage = (style: string, subOption?: string) => {
  if (style === 'casement' && subOption) {
    switch (subOption) {
      case 'left':
        return "/lovable-uploads/b874a9fa-457e-4134-90fc-d460d91eb02d.png";
      case 'right':
        return "/lovable-uploads/ec7ae7f2-7ff6-4e62-b330-480f955ac5c5.png";
      case 'stationary':
        return "/lovable-uploads/78a3d360-4d9e-4e82-b1cc-10598861e547.png";
      default:
        return "/lovable-uploads/78a3d360-4d9e-4e82-b1cc-10598861e547.png";
    }
  }

  if (style === 'horizontal-roller' && subOption) {
    switch (subOption) {
      case 'left-active':
      case 'right-active':
      case 'three-panel':
        return "/lovable-uploads/a7db2b78-c61d-4142-b7eb-04516c3ba179.png";
      default:
        return "/lovable-uploads/a7db2b78-c61d-4142-b7eb-04516c3ba179.png";
    }
  }

  switch (style) {
    case 'single-hung':
      return "/lovable-uploads/0ad439c6-c89a-43b1-966f-e77d73f5b7d2.png";
    case 'awning':
      return "/lovable-uploads/34071465-4922-47fe-986a-cf7b8b2346a2.png";
    case 'double-hung':
      return "/lovable-uploads/943d87fa-a111-4221-bdc0-f75e8043c3ee.png";
    case 'fixed':
      return "/lovable-uploads/78a3d360-4d9e-4e82-b1cc-10598861e547.png";
    default:
      return "/lovable-uploads/78a3d360-4d9e-4e82-b1cc-10598861e547.png";
  }
};