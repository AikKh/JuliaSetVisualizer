#include "SFML/Graphics.hpp"
#include "JuliaSet.hpp"

int main()
{
    int width = 1200;
    int height = 800;

    sf::RenderWindow window(sf::VideoMode(width, height), "My window");
    JuliaSet rt(width, height, window);
    rt.run();
}