Math.uid = function() {
	var s = [], hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {if(i === 14){s[i] = "4";}else if(i === 19){s[i] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);}else if( i=== 8 || i === 13 || i === 18 || i === 23){s[i] = "-";}else{s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);}}
    return s.join("");
};