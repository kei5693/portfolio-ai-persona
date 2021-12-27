const RULES = {
  regxEmail: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/,
  regxPassword: /^(?=.*[a-zA-z])(?=.*[0-9]).{8,}$/
}

export default RULES