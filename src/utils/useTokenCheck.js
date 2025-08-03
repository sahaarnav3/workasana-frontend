import { useEffect, useState } from "react";
// import { useNavigate } from "react-router";

const useTokenCheck = (url, token) => {
    const [tokenObject, setTokenObject] = useState({ tokenVerified: false, tokenData: {} });
    const [loading, setLoading] = useState(true);
    // const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const headers = {
        "Content-Type": "application/json",
      };
      headers.authorization = token;
      fetch(url, {
        headers: headers
      })
        .then(async response => {
          const tempResponse = await response.json();
          if(response.status === 401 || response.status === 403){
            setTokenObject({ tokenVerified: false, tokenData: tempResponse });
            // navigate('/login');
            setLoading(false);
          }
          else if(response.status === 200)
            setTokenObject({ tokenVerified: true, tokenData: tempResponse });
        })
        .catch(err => console.log(err));
    };
    fetchData()
  }, [url, token]);
  return { tokenObject, loading };
};

export default useTokenCheck;