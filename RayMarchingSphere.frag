#version 130

uniform vec3 light;
uniform vec2 resolution;
uniform float aspect;
uniform vec3 camera;
uniform vec2 cameraDir;

// Objects
uniform vec3 _sphere;
uniform float radious;

uniform vec3 _cube;
uniform float size;

// uniform vec3 _plane;

float lerp(float x, float y, float t) {
    return x * (1.0 - t) + y * t;
} 

float smin(float a, float b, float k)
{
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return lerp(b, a, h) - k * h * (1.0 - h);
}

float plane(in vec3 p)
{
    return p.y;
}

float sphere(in vec3 p, in vec3 s, in float r)
{
    p = vec3(mod(p.x, 6.0f), mod(p.y, 6.0f), p.z);
    return length(p - s) - r;
}

float cube(in vec3 p, in vec3 s, in float r)
{
    vec3 q = abs(p - s) - r;
    return length(max(q, 0)) + min(max(q.x, max(q.y, q.z)), 0);
}

// float fractalCube(in vec3 p, in float size, in int iterations)
// {
//     float distance = cube(p, vec3(0.0), size);

//     for (int i = 0; i < iterations; i++)
//     {
//         // Transform position to be centered at the origin
//         p -= 0.5 * size;

//         // Calculate absolute position within unit cube
//         vec3 pos = abs(p);

//         // Remove central cube from each side
//         pos = (pos - 0.5 * size) / max(size / 3.0, 0.00001); // Avoid division by zero
        
//         // Calculate distance
//         distance = max(distance, -min(
//             max(max(pos.x, pos.y), pos.z),
//             max(max(pos.x, pos.y), -pos.z),
//             max(max(pos.x, -pos.y), pos.z),
//             max(max(pos.x, -pos.y), -pos.z),
//             max(max(-pos.x, pos.y), pos.z),
//             max(max(-pos.x, pos.y), -pos.z),
//             max(max(-pos.x, -pos.y), pos.z),
//             max(max(-pos.x, -pos.y), -pos.z)
//         ));
        
//         // Scale down for next iteration
//         size /= 3.0;
//     }

//     return distance;
// }


float getDist(in vec3 p)
{
    // return min(
    //     plane(p),
    //     min(
    //         cube(p, _cube, size), 
    //         sphere(p, _sphere, radious)
    //     ) 
    // );
    //return smin(
    //    cube(p, _cube, size), 
    //    sphere(p, _sphere, radious),
    //    0.6f
        // fractalCube(p, size, 100)
    //);

    return sphere(p, _sphere, radious);
}

vec3 getNormal(in vec3 p)
{
    float d = getDist(p);
    vec2 e = vec2(0.001, 0);
    vec3 n = d - vec3(getDist(p - e.xyy), getDist(p - e.yxy), getDist(p - e.yyx));
    return normalize(n);
}

float getColor(in vec3 p)
{
    vec3 l = normalize(light - p);
    vec3 n = getNormal(p);
    return clamp(dot(n, l) * 0.7 + 0.5, 0, 1);
}

float rayMarch(in vec3 ro, in vec3 rd)
{ // Origin, Direction
    vec3 ray = ro;

    for (int i = 0; i < 100; i++)
    { // TODO: remove 100
        float dist = getDist(ray);

        if (dist > 50) return 0.1f; // Limit I guess
        
        ray += rd * dist;

        if (dist < 0.001)
        { // 0.001 is sort of resolution
            return getColor(ray);
        }
    } 

    return 0.0f;
}

void main()
{
    vec2 uv = gl_FragCoord.xy / resolution;
	uv.x *= aspect;

    vec3 ro = camera;
    vec3 rd = normalize(vec3(1, (uv - 0.5) * cameraDir));

    float hit = rayMarch(ro, rd);
    vec4 col = normalize(vec4(hit, hit, hit, 1.0f));;
    gl_FragColor = col;
}
