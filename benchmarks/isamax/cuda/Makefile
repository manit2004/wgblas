CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/isamax

$(BIN):
	mkdir -p $(BIN)

$(BIN)/isamax: isamax.c $(HDRS) | $(BIN)
	$(CC) isamax.c -o $(BIN)/isamax -lcublas

clean:
	rm -rf $(BIN)
