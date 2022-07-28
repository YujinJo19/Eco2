import styled from "styled-components";
let LoginInput = styled.input`
  background: #f7f8f9;
  border: 1px solid #dadada;
  border-radius: 8px;
  width: 330px;
  height: 50px;
  padding-left: 10px;
  margin: 5px 0;
`;

let GreenBtn = styled.button`
  background: #adc178;
  border: 1px solid #dadada;
  border-radius: 8px;
  width: 330px;
  height: 50px;
  text-align: center;
  color: white;
  cursor: pointer;
  margin-top: 10px;
`;

let ShortGreenBtn = styled.button`
  background: #adc178;
  border: 1px solid #dadada;
  border-radius: 8px;
  width: 150px;
  height: 50px;
  text-align: center;
  color: white;
  cursor: pointer;
  margin-top: 10px;
`;

let WarningText = styled.p`
  color: red;
  font-size: small;
`;

let Leaf = styled.img`
  position: absolute;
  height: 40px;
  z-index: 1000;
  left: ${(props) => props.left};
  top: ${(props) => props.top};
`;
export { GreenBtn, LoginInput, WarningText, ShortGreenBtn, Leaf };
