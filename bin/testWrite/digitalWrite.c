#include <stdio.h>

int main (int argc, char* argv[]) {
    if (argc < 3) {
        printf("Not enough arguments supplied\n");
        return 1;
    }
    printf("Supplied values are %s, %s\n", argv[1], argv[2]);
    return 0;
}