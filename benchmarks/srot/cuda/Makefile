CC = nvcc
TARGET = benchmark
SRC = benchmark.c

all: $(TARGET)

$(TARGET): $(SRC)
	$(CC) $(SRC) -o $(TARGET) -lcublas -lm

clean:
	rm -f $(TARGET)
