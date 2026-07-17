CC = nvcc
TARGET = benchmark
SRC = benchmark.c

all: $(TARGET)

$(TARGET): $(SRC) ../../utils/helpers.h
	$(CC) $(SRC) -o $(TARGET) -lcublas

clean:
	rm -f $(TARGET)
