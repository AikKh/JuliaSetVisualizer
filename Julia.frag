#version 130

precision highp float;

uniform highp vec2 constant;
uniform highp vec2 resolution;
uniform highp float aspect;

uniform highp float real_beg;
uniform highp float real_end;
uniform highp float imag_beg;
uniform highp float imag_end;

uniform int iterations;

const int paletteSize = 16;

const vec3 palette[paletteSize] = vec3[paletteSize](
    vec3( 13,  27 , 80),
    vec3( 25,   7 , 26),
    vec3(  9,   1 , 47),
    vec3(  4,   4 , 73),
    vec3(  0,   7 ,100),
    vec3( 12,  44 ,138),
    vec3( 24,  82 ,177),
    vec3( 57, 125 ,209),
    vec3(134, 181 ,229),
    vec3(211, 236 ,248),
    vec3(241, 233 ,191),
    vec3(248, 201 , 95),
    vec3(255, 170 ,  0),
    vec3(204, 128 ,  0),
    vec3(153,  87 ,  0),
    vec3(106,  52 ,  3)
);

vec2 squareComplex(in vec2 z)
{
    return vec2(pow(z.x, 2) - pow(z.y, 2), 2 * z.x * z.y);
}

float modulusComplex(in vec2 z)
{
    return sqrt(pow(z.x, 2) + pow(z.y, 2));
}

float inJuliaSet(in vec2 z, in int iterCount)
{
    for (int i = 1; i < iterCount; i++)
    {
        z = squareComplex(z) + constant;

        if (modulusComplex(z) > 2){
            return float(i);
        }
    }

    return 0.0;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;

    uv.x = uv.x * (real_end - real_beg) + real_beg;
    uv.y = uv.y * (imag_end - imag_beg) + imag_beg;
    uv.x *= aspect;

    float depth = inJuliaSet(uv, iterations);

    vec3 color = vec3(0, 0, 0);

    if (depth > 0)
    {
        int index = int(depth / 100 * float(paletteSize));
        color = palette[index];
    }

    gl_FragColor = normalize(vec4(color, 255));
}