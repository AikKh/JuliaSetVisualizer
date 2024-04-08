#version 130

uniform vec3 light;
uniform vec2 resolution;
uniform float aspect;

float plaIntersect(in vec3 ro, in vec3 rd, in vec4 p) {
	return -(dot(ro, p.xyz) + p.w) / dot(rd, p.xyz);
}

vec2 sphIntersect(in vec3 ro, in vec3 rd, float ra) {
    float b = dot(ro, rd);
    float c = dot(ro, ro) - ra * ra;
    float h = b * b - c;
    if (h < 0.0) return vec2(-1.0);
    h = sqrt(h);
    return vec2(-b - h, -b + h);
}

vec4 castRay(in vec3 ro, in vec3 rd) {
    // sphere => X, Y, Z, Radius
    vec4 sphere = vec4(0.0, 0.0, 0.0, 1.0);
	vec3 planeNormal = vec3(0.0, 0.0, -1.0);
    vec4 color = vec4(0.0);

    vec2 it;

	// Sphere intersection
	it = sphIntersect(ro - sphere.xyz, rd, sphere.w);
    if (it.x >= 0.0) {
		color = vec4(1.0, 0.0, 0.0, 1.0);
	}

	// Plane intersection
	// it = vec2(plaIntersect(ro, rd, vec4(planeNormal, 1.0)));
	// if(it.x > 0.0) {
	// 	color = vec4(0.5, 0.25, 0.1, 1.0);
	// }

	// Adding light
	vec3 intersect = ro + rd * it.x;
	vec3 normal = normalize(intersect);

	float diff = max(0.0, dot(normal, light));
	color *= diff;

    // vec3 intersect = ro + rd * t.y;
    // vec3 normal = normalize(intersect - sphere.xyz);
    // float diffuse = max(0.0, dot(normal, vec3(0.0, 0.0, -1.0)));

    // vec3 lightDir = normalize(vec3(0.3, 0.4, -1.0));
    // vec3 reflectDir = reflect(-lightDir, normal);
    // float specular = pow(max(0.0, dot(reflectDir, -rd)), 16.0);

    // color.rgb *= diffuse + specular;

    return color;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
	uv.x *= aspect;
    vec3 ro = vec3(-5.0, 0.0, 0.0);
    vec3 rd = normalize(vec3(1.0, uv - 0.5));
    vec4 col = castRay(ro, rd);
    gl_FragColor = col;
}
