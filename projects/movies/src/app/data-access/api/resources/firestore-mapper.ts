export const mapDocument = (entity: any) => {
  const fields = entity.fields;
  const result = Object.keys(fields).reduce((acc, key) => {
    acc[key] = fields[key][Object.keys(fields[key])[0]];
    return acc;
  }, {} as any);
  result.id = (entity.name ?? '').split('/').pop();
  return result
};

export const mapDocuments = (entities: any, flat = true): any => {
  if (!entities.documents) {
    return mapDocument(entities)
  }
  const result = entities.documents.map(mapDocument);
  if (flat) {
    return result;
  }
  return {
    results: result,
    page: 1,
    total_pages: 1,
    total_results: result.length
  };
};