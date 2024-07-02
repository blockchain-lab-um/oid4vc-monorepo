module.exports = {
  '*.ts': () => 'tsc -p tsconfig.json --noEmit --incremental false',
};
