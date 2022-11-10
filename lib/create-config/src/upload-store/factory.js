export const factory = () => {
  const region = process.env['UPLOAD_STORE_REGION'];
  const bucket = process.env['UPLOAD_STORE_BUCKET'];
  const uploaded = process.env['UPLOAD_STORE_DIRS_UPLOADED'];
  const parsed = process.env['UPLOAD_STORE_DIRS_PARSED'];
  const dirs = { uploaded, parsed };

  return { region, bucket, dirs };
};
