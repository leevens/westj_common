
export default class MD5 {
    /** Padding string for base64 output. */
    public static b64pad: string = "";
    /** 0 = lowercase hex, 1 = uppercase hex. */
    public static hexcase: number = 0;
    /** Bits per input char (8 for ascii/utf-16 low-byte, 16 for unicode). */
    public static chrsz: number = 8;
    public static md5_ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
        return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }
    public static binl2b64(binarray: number[]): string {
        const tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        let str = "";
        for (let i = 0; i < binarray.length * 4; i += 3) {
            const triplet = (((binarray[i >> 2] >> ((i % 4) * 8)) & 0xFF) << 16)
                | (((binarray[(i + 1) >> 2] >> (((i + 1) % 4) * 8)) & 0xFF) << 8)
                | ((binarray[(i + 2) >> 2] >> (((i + 2) % 4) * 8)) & 0xFF);
            for (let j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > binarray.length * 32)
                    str += this.b64pad;
                else
                    str += tab.charAt((triplet >> (6 * (3 - j))) & 0x3F);
            }
        }
        return str;
    }
    /** Add signed 32-bit integers while preserving wrap-around semantics. */
    public static safe_add(x: number, y: number): number {
        const lsw = (x & 0xFFFF) + (y & 0xFFFF);
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    public static core_hmac_md5(key: string, data: string): number[] {
        let bkey = this.str2binl(key);
        if (bkey.length > 16)
            bkey = this.core_md5(bkey, key.length * this.chrsz);
        const ipad: number[] = new Array(16);
        const opad: number[] = new Array(16);
        for (let i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 909522486;
            opad[i] = bkey[i] ^ 1549556828;
        }
        const hash = this.core_md5(ipad.concat(this.str2binl(data)), 512 + data.length * this.chrsz);
        return this.core_md5(opad.concat(hash), 640);
    }
    public static str2binl(str: string): number[] {
        const bin: number[] = [];
        const mask = (1 << this.chrsz) - 1;
        for (let i = 0; i < str.length * this.chrsz; i += this.chrsz) {
            bin[i >> 5] |= (str.charCodeAt(i / this.chrsz) & mask) << (i % 32);
        }
        return bin;
    }
    public static md5_cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
        return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
    }
    public static md5_ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
        return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    public static bit_rol(num: number, cnt: number): number {
        return (num << cnt) | (num >>> (32 - cnt));
    }
    public static binl2hex(binarray: number[]): string {
        const hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        let str = "";
        for (let i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF)
                + hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
        }
        return str;
    }
    public static md5_vm_test(): boolean {
        return this.hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
    }
    public static md5_hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
        return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }
    public static core_md5(x: number[], len: number): number[] {
        x[len >> 5] |= 128 << (len % 32);
        x[14 + ((len + 64 >>> 9) << 4)] = len;
        let a = 1732584193;
        let b = -271733879;
        let c = -1732584194;
        let d = 271733878;
        for (let i = 0; i < x.length; i += 16) {
            const olda = a, oldb = b, oldc = c, oldd = d;
            a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
            a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
            a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
            a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
            a = this.safe_add(a, olda);
            b = this.safe_add(b, oldb);
            c = this.safe_add(c, oldc);
            d = this.safe_add(d, oldd);
        }
        return [a, b, c, d];
    }
    public static hex_md5(s: string): string {
        return this.binl2hex(this.core_md5(this.str2binl(s), s.length * this.chrsz));
    }
    public static md5_gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
        return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
}
