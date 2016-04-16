export const userExists = rows => {
  var result = (rows.length === 0) ? false : true;
  return result;
}

export const isFalseClaim = (email, isTeacher) => {
  var emailDomain = typeof email !== 'undefined' ? email.split(".")[0] : '';
  var result = false;
  if (isTeacher) {
    if (emailDomain !== "twinkle") {
      result = true;
    }
  }
  return result;
}
