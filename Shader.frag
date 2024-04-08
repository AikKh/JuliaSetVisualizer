uniform float blue;

vec2 sphIntersect(in vec3 ro, in vec3 rd, float ra) {
	float b = dot(ro, rd);
	float c = dot(ro, ro) - ra * ra;
	float h = b * b - c;
	if(h < 0.0) return vec2(-1.0);
	h = sqrt(h);
	return vec2(-b - h, -b + h);
}

void main() {
    vec2 uv = gl_TexCoord[0].xy;
    gl_FragColor = vec4(uv, blue, 255);
}