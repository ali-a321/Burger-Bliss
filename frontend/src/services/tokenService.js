
export function checkTokenExpiration() {
    const tokenObject = JSON.parse(localStorage.getItem("authorization"));
    const token = tokenObject ? tokenObject.token : null;
  
    if (token === "ASMDIOWDASDK125301433162354" && tokenObject) {
      const currentTimestamp = new Date().getTime();
      if (currentTimestamp > tokenObject.expiration) {
        return false;//invalid
      }
    }
  
    return true; //valid 
  }
  