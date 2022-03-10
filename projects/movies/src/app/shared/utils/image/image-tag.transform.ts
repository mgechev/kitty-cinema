import { ImageTag } from './image-tag.interface';
import { ImageDimensions } from '../../../data-access/api/constants/image-dimensions.interface';

export function addImageTag<T extends Object>(
  _res: T,
  options: {
    pathProp: keyof T;
    dims: ImageDimensions;
    fallback?: string;
    baseUrl?: string;
  }
): T & ImageTag {
  let { pathProp, fallback, baseUrl, dims } = options;
  baseUrl = baseUrl || `/assets/images/`;
  fallback = fallback || `assets/images/no_poster_available.jpg`;

  const res = _res as T & ImageTag;

  res.imgUrl = res[pathProp]
    ? `${baseUrl}/${res[pathProp]}`
    : fallback;
  res.imgWidth = dims.WIDTH;
  res.imgHeight = dims.HEIGHT;
  res.imgRatio = res.imgWidth / res.imgHeight;

  return res;
}
