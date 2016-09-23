module.exports = {
  userExists(rows) {
    var result = rows.length !== 0;
    return result;
  },
  isFalseClaim(email, isTeacher) {
    var emailDomain = typeof email !== 'undefined' ? email.split(".")[0] : '';
    var result = false;
    if (isTeacher) {
      if (emailDomain !== "twinkle") {
        result = true;
      }
    }
    return result;
  }
}
