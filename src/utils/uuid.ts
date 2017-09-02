import { v4 as uuidV4 } from 'uuid';

export function uuid32() {
  return uuidV4().split('-').join('');
}

export function uuid48() {
  return (uuidV4() + uuidV4()).split('-').join('').slice(0, 48);
}
