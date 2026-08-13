CC = nvcc
BIN = bin

all: $(BIN)/isamax $(BIN)/stride.isamax

$(BIN):
	mkdir -p $(BIN)

$(BIN)/isamax: isamax.c ../../utils/helpers.h | $(BIN)
	$(CC) isamax.c -o $(BIN)/isamax -lcublas

$(BIN)/stride.isamax: stride.isamax.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.isamax.c -o $(BIN)/stride.isamax -lcublas

clean:
	rm -rf $(BIN)
